const colors = require('./colors.json');
const fs = require('fs')

let sassContent = '$colors: (\n';
let tsContent = 'export const colors = {\n';
for (let color of Object.keys(colors)) {
    sassContent += `  "${color}": ${colors[color]},\n`;
    tsContent += `    ${color}: '${colors[color]}',\n`;
}
sassContent += ');\n';
tsContent += '};\n';


fs.writeFile('colors.scss', sassContent, err => {
    if (err) {
        console.error(err);
        return;
    }
});

fs.writeFile('colors.ts', tsContent, err => {
    if (err) {
        console.error(err);
        return;
    }
});
