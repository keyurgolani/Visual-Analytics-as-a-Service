def run_node(dataset, utils, logic):
    logic_id = utils.write_to_file(logic)
    import importlib
    code_module = importlib.import_module(logic_id.rstrip(".py").replace("/", "."))
    dataset = dataset.map(code_module.run_logic)
    return dataset.collect()