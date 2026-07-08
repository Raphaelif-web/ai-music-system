-- Mars Sound AI: enums, extensions, and private schema for privileged functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS private;

CREATE TYPE public.user_role AS ENUM ('USER', 'CREATOR', 'ADMIN', 'MODERATOR');
CREATE TYPE public.track_status AS ENUM ('DRAFT', 'PROCESSING', 'PUBLISHED', 'ARCHIVED', 'REJECTED');
CREATE TYPE public.playlist_visibility AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');
CREATE TYPE public.notification_type AS ENUM ('LIKE', 'COMMENT', 'FOLLOW', 'PLAYLIST_ADD', 'NEW_TRACK', 'SYSTEM');
