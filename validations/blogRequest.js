exports.getBlog = async (req) => {
    const { slug } = req.params;
    // checks if id entered by user
    if (!slug) {
        return ["Please enter slug"];
    }

    return [];
};