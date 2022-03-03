# Data Conversion

This folder contains a python module to convert the excel data to JSON format.

## CLI

From this directory, you can convert a file with

```bash
python -m convert your-input-file.xlsx
```

The output will be saved at `your-input-file.json` . You can also provide an output file:

```bash
python -m convert your-input-file.xlsx your-output-file.json
```

Tests are run with

```bash
pytest
```
