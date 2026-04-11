import { Project } from "../models/project.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await ProjectNote.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        createdBy: {
          $arrayElemAt: ["$createdBy", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        project: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await ProjectNote.create({
    content,
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  const note = await ProjectNote.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(noteId),
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        createdBy: {
          $arrayElemAt: ["$createdBy", 0],
        },
      },
    },
  ]);

  if (!note || note.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note[0], "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { content } = req.body;

  const note = await ProjectNote.findOne({
    _id: new mongoose.Types.ObjectId(noteId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const updatedNote = await ProjectNote.findByIdAndUpdate(
    noteId,
    {
      $set: { content },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  const note = await ProjectNote.findOne({
    _id: new mongoose.Types.ObjectId(noteId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  await ProjectNote.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export { getNotes, createNote, getNoteById, updateNote, deleteNote };