def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Duplicate Column"
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
        Logic to duplicate a column or multiple columns and either
        append them at the end or interleave them within original
        columns and return the row
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with the given column/s duplicated and appended at right
        place
        :rtype: list
        """
        if params['interleave']:
            for current_column in range(params['end'], params['start'] - 1, -1):
                row[current_column:current_column + 1] = [row[current_column],
                                                          row[current_column]]
        else:
            row[params['start']:params['end'] + 1] = row[
                params['start']:params['end'] + 1] + row[
                    params['start']:params['end'] + 1]
        return row
    return rdd.map(run_logic)
