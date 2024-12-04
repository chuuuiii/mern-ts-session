import { RequestHandler, response } from "express"
import Notes from "../models/notes.model";
import mongoose from "mongoose";


export const getNotes: RequestHandler = async (req, res, next) => {
  const { id } = req.body;
  try {
    const notes = await Notes.find(id).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes })
  } catch (error) {
    next(error);
  }
}

interface createNotes {
  title: string,
  note: string
}

export const createNote: RequestHandler<unknown, unknown, createNotes> = async (req, res, next) => {
  const { title, note } = req.body;

  try {
    if (!title || !note) {
      res.status(400).json({ success: false, message: 'Please provide both title and note' })
    }

    const newNote = new Notes({ title, note });
    await newNote.save();
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    next(error);
  }
};



interface UpdateNoteParams {
  id: string;
}

interface UpdateNoteBody {
  title?: string;
  note?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody> = async (req, res, next) => {
  const { id } = req.params; 
  const { title, note } = req.body; 

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'No update data provided' });
      return; 
    }

    // Update the note
    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      { title, note },
      { new: true, runValidators: true } // Returns the updated document
    );

    // Check if the note was found
    if (!updatedNote) {
      res.status(404).json({ success: false, message: 'Note not found' });
      return;
    }

    // Return the updated note
    res.status(200).json({
      success: true,
      message: 'Note successfully updated',
      data: updatedNote,
    });
  } catch (error) {
    next(error); 
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const deleteNote = await Notes.findByIdAndDelete(id);
    if (!deleteNote) {
      res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully', data: deleteNote });
  } catch (error) {
    next(error);
  }
};