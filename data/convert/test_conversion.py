from lib2to3.pytree import convert
import pytest
from convert.convert import convert_file
import os
import json

EXAMPLE_IN = 'example/example.xlsx'
EXAMPLE_OUT = 'example/example.json'
EXAMPLE_TARGET = 'example/example_target.json'


def load_results():
    with open(EXAMPLE_OUT) as input:
        result = json.loads(input.read())
    
    with open(EXAMPLE_TARGET) as input:
        target = json.loads(input.read())
    
    return result, target

def check_table(table, result, target):
    results = result[table]
    targets = target[table]

    assert len(results) == len(targets)

    for result_item, target_item in zip(results, targets):
        assert result_item.keys() == target_item.keys()
        for key in target_item:
            assert result_item[key] == target_item[key]

def test_data(convert_example):
    assert os.path.exists(EXAMPLE_OUT)
    result, target = load_results()

    for table in target:
        assert table in result

        check_table(table, result, target)

@pytest.fixture
def convert_example():
    convert_file(EXAMPLE_IN, EXAMPLE_OUT)