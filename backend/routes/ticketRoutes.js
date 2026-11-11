import { generateAiReply } from '../services/aiAgent.js';
import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// Create a new ticket
// CREATE a new ticket (with AI reply + escalation) → POST /api/tickets
router.post('/', async (req, res) => {
  try {
    const { subject, description } = req.body;

    // 1. Ask the AI agent for a reply (fall back gracefully if it fails)
    let aiReply = '';
    try {
      aiReply = await generateAiReply(subject, description);
    } catch (err) {
      console.log('AI reply failed:', err.message);
      aiReply = 'Thanks for reaching out — our team will review your ticket shortly.';
    }

    // 2. Simple escalation rule: urgent/sensitive words go straight to a human
    const text = `${subject} ${description}`.toLowerCase();
    const escalateWords = ['refund', 'legal', 'lawsuit', 'urgent', 'angry', 'cancel'];
    const shouldEscalate = escalateWords.some((word) => text.includes(word));

    // 3. Save the ticket with the AI reply and the right status
    const ticket = await Ticket.create({
      subject,
      description,
      aiReply,
      status: shouldEscalate ? 'escalated' : 'open',
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Read all tickets
router.get('/', async (req,res) =>{
    try{
        const tickets = await Ticket.find().sort({createdAt: -1});
        res.json(tickets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


//Read a single ticket 
router.get('/:id', async (req,res) =>{
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({message: 'Ticket not found'});
        res.json(ticket);
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

// Update a tickets status 
router.patch('/:id', async (req,res) => {
    try{
        const ticket = await Ticket.findByIdAndDelete(req.params.id, req.body, {
            new: true,
        });
        if (!ticket) return res.status(404).json({message: 'Ticket not found'});
        res.json(ticekt);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

//Delete a ticket
router.delete('/:id', async (req,res) => {
    try{
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({message: 'Ticket not found'});
        res.json({message: 'Ticket deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router; 

