import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        subject:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'in progress', 'resolved', 'escalated'],
            default: 'open',
        },
        aiReply: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
