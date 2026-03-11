import { type Document, model, Schema } from "mongoose";

export interface ILink extends Document {
	url: string;
	title?: string;
	description?: string;
	image?: string;
	domain?: string;
	tags: string[];
	category?: string;
	notes?: string;
	isFavorite: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
	{
		url: { type: String, required: true },
		title: { type: String },
		description: { type: String },
		image: { type: String },
		domain: { type: String },
		tags: { type: [String], default: [] },
		category: { type: String },
		notes: { type: String },
		isFavorite: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

export const Link = model<ILink>("Link", linkSchema);
