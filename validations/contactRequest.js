exports.postContact = async (req) => {
    const { name } = req.body;
    const { email } = req.body;
    const { message } = req.body;
    const { subject } = req.body;

    if (!name) {
        return ["Please enter name"];
    }

    if (!subject) {
        return ["Please enter subject"];
    }

    if (!email) {
        return ["Please enter email"];
    }

    if (!message) {
        return ["Please enter message"];
    }

    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email)) {
        return ["Invalid email"];
    }

    return [];
};