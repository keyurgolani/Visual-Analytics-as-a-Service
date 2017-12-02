from entities import Dataset
from DbHelper import DbHelper
from errors import MoreThanOneResultError

db = DbHelper()


def add_dataset(dataset):
    """
    Method gets the formatted insert query from the given Dataset object and
    executes insert method on the DbHelper object in order to insert Dataset
    object values to the database
    :param dataset: Dataset object to be inserted to the database
    :return: the same Dataset object with ID in database after insert
    """
    dataset.dataset_id = db.insert(dataset.get_insert_query())
    return dataset


def get_dataset(dataset):
    """
    Method gets the formatted query from the given dataset object and
    executes the query method on the DbHelper object in order to fetch values
    and fill the Dataset object from database
    :param dataset: Dataset object with ID to be filled with other details
    :return: the same Dataset object filled with details after search query
    """
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
