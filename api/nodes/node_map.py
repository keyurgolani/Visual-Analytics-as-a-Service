def run_node(rdd, utils, logic):
    logic_id = utils.write_to_file(logic)
    import importlib
    code_module = importlib.import_module(logic_id.rstrip(".py").replace(
        "/", "."))
    return rdd.map(code_module.run_logic)
