import type { components } from "./schema";

type S = components['schemas']

export type Drop = S['Drop']
export type DropPage = S['DropPage']
export type Category = S['Category']
export type AuthResponse = S['AuthResponse']
export type PrivateUser = S['PrivateUser']
export type Comment = S['Comment']
export type CommentPage = S['CommentPage']
export type CommentReactionState = S['CommentReactionState']
export type ErrorResponse = S['ErrorResponse']
export type UserProfile = S['Profile']