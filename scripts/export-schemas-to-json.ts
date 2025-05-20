import { SchemaFactory } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';

// Import all schema classes using relative paths
import { CartSchemaClass } from '../src/cart/schema/cart.schema';
import { CustomerSchemaClass } from '../src/customer/schema/customer.schema';
import { OrderSchemaClass } from '../src/order/schema/order.schema';
import { PetSchemaClass } from '../src/pet/schema/pet.schema';
import { ProductSchemaClass } from '../src/product/schema/product.schema';
import { ServiceSchemaClass } from '../src/service/schema/service.schema';

interface SchemaPath {
  instance: string;
  isRequired: boolean;
  options?: {
    ref?: string;
  };
}

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  ref?: string;
}

interface SchemaDefinition {
  name: string;
  fields: SchemaField[];
}

function extractSchemaInfo(schemaClass: any): SchemaDefinition {
  const schema = SchemaFactory.createForClass(schemaClass);
  const paths: Record<string, SchemaPath> = schema.paths as any;
  const fields: SchemaField[] = [];

  for (const [pathName, path] of Object.entries(paths)) {
    if (pathName === '_id' || pathName === '__v') continue;
    
    const fieldInfo: SchemaField = {
      name: pathName,
      type: path.instance,
      required: path.isRequired || false
    };

    if (path.options?.ref) {
      fieldInfo.ref = path.options.ref;
    }

    fields.push(fieldInfo);
  }

  return {
    name: schemaClass.name.replace('SchemaClass', ''),
    fields
  };
}

const schemas = [
    OrderSchemaClass,
    CustomerSchemaClass,
    CartSchemaClass,
    ProductSchemaClass,
    PetSchemaClass,
    ServiceSchemaClass
].map(extractSchemaInfo);

const output = {
    schemas,
    createdAt: new Date().toISOString()
};

const outputPath = path.join(__dirname, '../schema-export.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Schema exported to ${outputPath}`);