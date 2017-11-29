import os
import uuid
import importlib
utils = importlib.import_module("utils")


class Entity(object):
    def __init__(self):
        pass


class Dataset(Entity):
    def __init__(self,
                 dataset_id=None,
                 beautiful_name="Dataset {}".format(str(uuid.uuid4())),
                 filename=None,
                 root_path=utils.default_data_path,
                 owner=None,
                 is_private=True
                 ):
        self.dataset_id = dataset_id
        self.beautiful_name = beautiful_name
        self.filename = filename
        self.root_path = root_path
        self.owner = owner
        self.is_private = is_private

    def get_insert_query(self):
        keys = []
        values = []
        for key, value in self.__dict__.items():
            if value:
                keys.append(key)
                values.append(value)
        return "insert into DATASETS (%s) values (%s)" % (
            ','.join(keys), ','.join(map(utils.encode_value, values)))

    def get_search_query(self):
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
        return os.path.join(self.root_path, self.filename)
