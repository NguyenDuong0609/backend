exports.getUserId = async (req) => {
    const { id } = req.params.id;
    // checks if id entered by user
    if (!id) {
        return ["Please enter id"];
    }

    return [];
};

exports.addCategory = async (req) => {
    const {name, slug } = req.body;
    // checks if id entered by user
    if (!name || !slug) {
        return ["Please enter name & slug"];
    }

    return [];
};

exports.updateCategory = async (req) => {
    const { _id, name, slug, type } = req.body;
    // checks if id entered by user
    if (!name || !slug || !_id || !type) {
        return ["Please enter _id & name & slug & type"];
    }

    return [];
};

exports.deleteCategory = async (req) => {
    const { id } = req.params.id;
    // checks if id entered by user
    if (!id) {
        return ["Please enter id"];
    }

    return [];
};

exports.getBlog = async (req) => {
    const { id } = req.params.id;
    // checks if id entered by user
    if (!id) {
        return ["Please enter id"];
    }

    return [];
};

exports.addBlog = async (req) => {
    const {title, slug, description, content, category, tags } = req.body;
    // checks if id entered by user
    if (!title || !slug || !description || !content || !category || !tags) {
        return ["Please enter title & slug & description & content & category & tags"];
    }

    return [];
};

exports.updateBlog = async (req) => {
    const {title, slug, description, content, category } = req.body;
    //const { id } = req.params.id;
    // checks if id entered by user
    if (!title || !slug || !description || !content || !category) {
        return ["Please enter title & slug & description & content & category"];
    }

    // if (!id) {
    //     return ["Please enter id"];
    // }

    return [];
};

exports.deleteBlog = async (req) => {
    const { id } = req.params;
    // checks if id entered by user
    if (!id) {
        return ["Please enter id"];
    }

    return [];
};