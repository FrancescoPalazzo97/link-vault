import {
	extendZodWithOpenApi,
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { createLinkSchema, loginSchema, updateLinkSchema } from "@link-vault/shared";
import z from "zod";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

const linkResponseSchema = createLinkSchema.extend({
	_id: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

const linksListResponseSchema = z.object({
	links: z.array(linkResponseSchema),
	total: z.number(),
	page: z.number(),
	totalPages: z.number(),
});

const errorResponseSchema = z.object({
	error: z.string(),
});

const healthResponseSchema = z.object({
	status: z.string(),
	db: z.enum(["connected", "disconnected"]),
});

const authResponseSchema = z.object({
	token: z.string(),
});

const previewResponseSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	domain: z.string().optional(),
});

registry.register("Link", linkResponseSchema);
registry.register("CreateLink", createLinkSchema);
registry.register("UpdateLink", updateLinkSchema);
registry.register("Login", loginSchema);

// POST /auth/login
registry.registerPath({
	method: "post",
	path: "/auth/login",
	summary: "Login",
	tags: ["Auth"],
	request: {
		body: {
			content: { "application/json": { schema: loginSchema } },
		},
	},
	responses: {
		200: {
			description: "JWT token",
			content: { "application/json": { schema: authResponseSchema } },
		},
		401: {
			description: "Invalid password",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// POST /auth/logout
registry.registerPath({
	method: "post",
	path: "/auth/logout",
	summary: "Logout",
	tags: ["Auth"],
	responses: {
		204: { description: "Logged out" },
	},
});

// GET /health
registry.registerPath({
	method: "get",
	path: "/health",
	summary: "Health check",
	tags: ["Health"],
	responses: {
		200: {
			description: "Server status",
			content: { "application/json": { schema: healthResponseSchema } },
		},
	},
});

// GET /links
registry.registerPath({
	method: "get",
	path: "/links",
	summary: "List links with filters and pagination",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		query: z.object({
			search: z.string().optional(),
			tags: z.string().optional(),
			category: z.string().optional(),
			isFavorite: z.string().optional(),
			page: z.coerce.number().optional(),
			limit: z.coerce.number().optional(),
		}),
	},
	responses: {
		200: {
			description: "Paginated links list",
			content: { "application/json": { schema: linksListResponseSchema } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// GET /links/:id
registry.registerPath({
	method: "get",
	path: "/links/{id}",
	summary: "Get a single link",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		200: {
			description: "Link details",
			content: { "application/json": { schema: linkResponseSchema } },
		},
		404: {
			description: "Link not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// POST /links
registry.registerPath({
	method: "post",
	path: "/links",
	summary: "Create a new link",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: { "application/json": { schema: createLinkSchema } },
		},
	},
	responses: {
		201: {
			description: "Created link",
			content: { "application/json": { schema: linkResponseSchema } },
		},
		400: {
			description: "Validation error",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// PATCH /links/:id
registry.registerPath({
	method: "patch",
	path: "/links/{id}",
	summary: "Update a link",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: z.string() }),
		body: {
			content: { "application/json": { schema: updateLinkSchema } },
		},
	},
	responses: {
		200: {
			description: "Updated link",
			content: { "application/json": { schema: linkResponseSchema } },
		},
		404: {
			description: "Link not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// DELETE /links/:id
registry.registerPath({
	method: "delete",
	path: "/links/{id}",
	summary: "Delete a link",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		204: { description: "Link deleted" },
		404: {
			description: "Link not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

// POST /links/preview
registry.registerPath({
	method: "post",
	path: "/links/preview",
	summary: "Fetch Open Graph preview for a URL",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({ url: z.string().url() }),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Preview data",
			content: { "application/json": { schema: previewResponseSchema } },
		},
	},
});

// GET /links/tags
registry.registerPath({
	method: "get",
	path: "/links/tags",
	summary: "Get all unique tags",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "List of tags",
			content: {
				"application/json": {
					schema: z.array(z.string()),
				},
			},
		},
	},
});

// GET /links/categories
registry.registerPath({
	method: "get",
	path: "/links/categories",
	summary: "Get all unique categories",
	tags: ["Links"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "List of categories",
			content: {
				"application/json": {
					schema: z.array(z.string()),
				},
			},
		},
	},
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
	openapi: "3.0.0",
	info: {
		title: "LinkVault API",
		version: "1.0.0",
		description: "API for saving, organizing, and retrieving links",
	},
	servers: [{ url: "/api", description: "API Server" }],
});
