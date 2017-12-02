def run_node(rdd, utils, params):
    """
    Logic for Node "Split Using Delimiter"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: Parameters passed from client for the Node
    :type params: dict
    :return: RDD with Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    def run_logic(row):
        """
        Logic to split given column using given delimiter and return
        the whole row with the column replaced
        :param row: each row to be passed to the function while mapping
        :type row: str or list
        :return: row after performing the operation
        :rtype: str or list
        """
        if type(row) == 'list':
            row[params['column']:params['column'] + 1] = row[
                params['column']].split(params['delimiter']) or []
        else:
            row = row.split(params['delimiter'])
        return row
    return rdd.map(run_logic)
