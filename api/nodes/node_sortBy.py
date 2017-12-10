def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Sort By"
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
        Logic to convert row to (key, value) pairs to sort by key
        :param row: original row to be converted to (key, value) pairs
        :type row: list
        :return: row converted to (key, value) pair tuples
        :rtype: tuple
        """
        row = (row[params[
            'column']], row[:params['column']] + row[params['column'] + 1:])
        return row

    def reverse_map_logic(row):
        """
        Logic to reverse the mapping of row to (key, value) pairs
        :param row: (key, value) pairs to be reverted back to list
        :type row: tuple
        :return: row converted back to list
        :rtype: list
        """
        return row[1][:params['column']] + [row[0]] + row[1][params['column']:]
    return rdd.map(map_logic).sortByKey(ascending=params[
        'ascending'] if 'ascending' in params.keys() else False).map(
        reverse_map_logic)
