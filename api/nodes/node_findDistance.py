def run_node(rdd, utils, params, parked):
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
    from math import sin, cos, sqrt, atan2, radians
    R = 6373.0

    def find_distance(reference_point, current_point):
        dlon = radians(current_point[0]) - radians(reference_point[0])
        dlat = radians(current_point[1]) - radians(reference_point[1])

        a = sin(dlat / 2)**2 + cos(radians(reference_point[1])) * cos(radians(current_point[1])) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return abs(R * c * 0.62137 if params['unit'] == 'miles' else R * c)

    def map_logic(row):
        """
        Logic to map the rows in (key, value) form to be reduced by key
        :param row: first row for aggregation
        :type row: list
        :return: row in form of (key, value) pair
        :rtype: tuple
        """
        distance = find_distance((row[params['lat1']], row[params['lng1']]),
                                 (row[params['lat2']], row[params['lng2']]))
        if 'remove' in params.keys() and params['remove'] == True:
            del row[params['lat1']]
            del row[params['lat2']]
            del row[params['lng1']]
            del row[params['lng2']]
        row.append(distance)
        return row

    return rdd.map(map_logic)
