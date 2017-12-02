def run_node(rdd, utils, params):
    """
    Logic for Node "Convert Type"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def run_logic(row):
        """
        Logic to convert the type of given column or multiple columns
        to another type given in params from client side and return the row
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with the given column/s converted into given new type
        :rtype: list
        """
        for column in params['columns']:
            if params['toType'] == 'integer':
                row[column] = int(row[column])
            elif params['toType'] == 'float':
                row[column] = float(row[column])
            elif params['toType'] == 'string':
                row[column] = str(row[column])
            elif params['toType'] == 'long':
                row[column] = long(row[column])
            elif params['toType'] == 'boolean':
                row[column] = bool(row[column])
            elif params['toType'] == 'set':
                row[column] = set(row[column])
            elif params['toType'] == 'list':
                row[column] = list(row[column])
            elif params['toType'] == 'tuple':
                row[column] = tuple(row[column])
            else:
                import errors
                raise errors.UnimplementedOperationError()
        return row
    return rdd.map(run_logic)
