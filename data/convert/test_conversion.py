from lib2to3.pytree import convert
import pytest
from convert.convert import convert_file
import os

EXAMPLE_IN = 'example/example.xlsx'
EXAMPLE_OUT = 'example/example.json'

def test_conversion(convert_example):
    assert os.path.exists('example/example.json')

@pytest.fixture
def convert_example():
    convert_file(EXAMPLE_IN, EXAMPLE_OUT)