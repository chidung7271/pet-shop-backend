const fs = require('fs');
const data = require('../schema-export.json');

function convertToDrawIO(schemas) {
    let mxfile = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile>
  <diagram name="Database Schema">
    <mxGraphModel>
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />`;

    // Calculate positions for each table
    const positions = {};
    let x = 20, y = 20;

    // Create tables
    schemas.forEach((schema, i) => {
        positions[schema.name] = { x, y };

        mxfile += `
        <mxCell id="${schema.name}" value="${schema.name}" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="160" height="${26 + schema.fields.length * 26}" as="geometry" />
        </mxCell>`;

        // Add fields
        schema.fields.forEach((field, j) => {
            const fieldText = `${field.name}: ${field.type}${field.required ? ' (required)' : ''}`;
            mxfile += `
        <mxCell id="${schema.name}_${field.name}" value="${fieldText}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${schema.name}">
          <mxGeometry y="${26 + j * 26}" width="160" height="26" as="geometry" />
        </mxCell>`;
        });

        x += 200;
        if (x > 600) {
            x = 20;
            y += 200;
        }
    });

    // Create relationships
    schemas.forEach(schema => {
        schema.fields.forEach(field => {
            if (field.ref) {
                const sourceId = schema.name;
                const targetId = field.ref;

                mxfile += `
        <mxCell id="rel_${sourceId}_${targetId}" style="edgeStyle=none;curved=1;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>`;
            }
        });
    });

    mxfile += `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    return mxfile;
}

const drawioXML = convertToDrawIO(data.schemas);
fs.writeFileSync('schema-export.drawio', drawioXML);
console.log('Draw.io file created: schema-export.drawio');