def run_node(rdd, utils, params):
    def run_logic(row):
        row = map(lambda y: y[1], filter(lambda x: (x[0] in params['indexes'])
                                         if (params['operation'] == 'keep')
                                         else (x[0] not in params['indexes']),
                                         enumerate(row)))
        return row
    return rdd.map(run_logic)
