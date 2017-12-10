def run_node(rdd, utils, params, parked):
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
        for column in params['column']:
            if params['toType'] == 'integer':
                try:
                    row[column] = int(row[column])
                except:
                    row[column] = 0
            elif params['toType'] == 'float':
                try:
                    row[column] = float(row[column])
                except:
                    row[column] = 0
            elif params['toType'] == 'string':
                try:
                    row[column] = str(row[column])
                except:
                    row[column] = ""
            elif params['toType'] == 'long':
                try:
                    row[column] = long(row[column])
                except:
                    row[column] = 0L
            elif params['toType'] == 'boolean':
                try:
                    row[column] = bool(row[column])
                except:
                    row[column] = False
            elif params['toType'] == 'set':
                try:
                    row[column] = set(row[column])
                except:
                    row[column] = set()
            elif params['toType'] == 'list':
                try:
                    row[column] = list(row[column])
                except:
                    row[column] = []
            elif params['toType'] == 'tuple':
                try:
                    row[column] = tuple(row[column])
                except:
                    row[column] = tuple()
            else:
                import errors
                raise errors.UnimplementedOperationError()
        return row
    return rdd.map(run_logic)
