def run_node(rdd, utils, params):
    def run_logic(row):
        row[params['at']:params['at'] + 1] = [row[params['at']],
                                              str(params['value'])]
        return row
    return rdd.map(run_logic)
