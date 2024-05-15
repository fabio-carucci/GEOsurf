import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    via: {
        type: String,
        required: true
    },
    città: {
        type: String,
        required: true
    },
    CAP: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: false
    },
    regione: {
        type: String,
        required: false
    },
    paese: {
        type: String,
        required: true
    }
});

export default addressSchema;