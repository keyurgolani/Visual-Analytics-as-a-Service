from entities import *
from DbHelper import DbHelper
from errors import *

db = DbHelper()

def add_dataset(dataset):
    dataset.dataset_id = db.insert(dataset.get_insert_query())
    return dataset

def get_dataset(dataset):
    result = db.query(dataset.get_search_query())
    if len(result) != 1:
        raise MoreThanOneResultError()
    else:
        return Dataset(
            dataset_id=result[0]['dataset_id'],
            beautiful_name=result[0]['beautiful_name'],
            filename=result[0]['filename'],
            root_path=result[0]['root_path'],
            owner=result[0]['owner'],
            is_private=result[0]['is_private']
        )
