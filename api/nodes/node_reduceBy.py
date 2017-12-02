def run_node(rdd, utils, params):
    """
    Logic for Node "Reduce By"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def map_logic(row):
        """
        Logic to map the rows in (key, value) form to be reduced by key
        :param row: first row for aggregation
        :type row: list
        :return: row in form of (key, value) pair
        :rtype: tuple
        """
        tup = (row[params[
            'column']], row[:params['column']] + row[params['column'] + 1:])
        return tup

    def reduce_logic(row1, row2):
        """
        Logic to reduce the rows with key and aggregate the values using
        given parameter in params
        :param row1: first row for aggregation
        :type row1: list
        :param row2: second row for aggregation
        :type row2: list
        :return: aggregated row for the reduced rows
        :rtype: list
        """
        if params['aggregation'] == 'list':
            return [list(x) for x in zip(row1, row2)]
        elif params['aggregation'] == 'add':
            return [x[0] + x[1] for x in zip(row1, row2)]
        elif params['aggregation'] == 'xor':
            return [x[0] ^ x[1] for x in zip(row1, row2)]
        elif params['aggregation'] == 'multiply':
            return [x[0] * x[1] for x in zip(row1, row2)]
        elif params['aggregation'] == 'append':
            return [str(x[0]) + str(x[1]) for x in zip(row1, row2)]
        else:
            import errors
            raise errors.UnimplementedOperationError()
    return rdd.map(map_logic).reduceByKey(reduce_logic)
