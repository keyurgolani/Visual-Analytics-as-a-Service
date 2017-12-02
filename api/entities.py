import os
import uuid
import importlib
utils = importlib.import_module("utils")


class Entity(object):
    """
    Base class for any entity
    """
    def __init__(self):
        """
        Dummy Init for base class
        """
        pass


class Dataset(Entity):
    """
    Entity Class for Dataset
    """
    def __init__(self,
                 dataset_id=None,
                 beautiful_name="Dataset {}".format(str(uuid.uuid4())),
                 filename=None,
                 root_path=utils.default_data_path,
                 owner=None,
                 is_private=True
                 ):
        """
        Constructor for creating the dataset object given the values of the
        parameters
        :param dataset_id: id of the dataset into database
        :param beautiful_name: name of the dataset to be displayed
        :param filename: name of the file saved on disk for dataset
        :param root_path: path the dataset file is saved
        :param owner: owner user id for the dataset
        :param is_private: is the dataset private or visible to public
        """
        self.dataset_id = dataset_id
        self.beautiful_name = beautiful_name
        self.filename = filename
        self.root_path = root_path
        self.owner = owner
        self.is_private = is_private

    def get_insert_query(self):
        """
        Method will construct the insert query for all the present values of
        the object to be executed at the time of inserting object into database
        :return: Constructed SQL query for insert
        """
        keys = []
        values = []
        for key, value in self.__dict__.items():
            if value:
                keys.append(key)
                values.append(value)
        return "insert into DATASETS (%s) values (%s)" % (
            ','.join(keys), ','.join(map(utils.encode_value, values)))

    def get_search_query(self):
        """
        Method will construct the search query with the id of the dataset
        object to search more details about the dataset from database
        :return: Constructed SQL query for search
        """
        if self.dataset_id:
            return ("select * from DATASETS where dataset_id = %s"
                    % self.dataset_id)
        else:
            keys = []
            values = []
            for key, value in self.__dict__.items():
                if value:
                    keys.append(key)
                    values.append(value)
            return "select * from DATASETS where (%s)" % (' and '.join(
                ["{} = {}".format(key, value) for (key, value) in zip(
                    keys, map(utils.encode_value, values))]))

    def get_full_path(self):
        """
        Method gives file path on server where the dataset can be accessed at
        :return: path of the dataset file
        """
        return os.path.join(self.root_path, self.filename)
