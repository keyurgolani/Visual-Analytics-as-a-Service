def run_node(rdd, utils, params):
    def run_logic(row):
        row[params['start']:params['end'] + 1] = [params['delimeter'].join(
            row[params['start']:params['end'] + 1])]
        return row
    return rdd.map(run_logic)
