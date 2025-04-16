/* eslint-disable prettier/prettier */
import { type TMenuConfig } from '@/components/menu';
import { verifyRole } from '@/api/api'
import * as React from 'react';
import { useState, useEffect } from 'react';

const res = await verifyRole();
const role = res?.data?.role ?? []; export const getSidebarMenu = (type: string, roles: string[]): TMenuConfig => [
	{
		title: 'Dashboard',
		icon: 'element-11',
		path: '/'
	},
	{
		title: 'Tickets',
		icon: 'document',
		path: '/public-profile/projects/3-columns'
	},
	...(roles.includes('ADMIN') ? [
		{
			title: 'Admin Panel',
			icon: 'shield',
			path: '/admin'
		}
	] : []),
	...(roles.includes('AGENT') ? [
		{
			title: 'Agent Tools',
			icon: 'shield',
			path: '/agent'
		}
	] : [])
];


export const getMegaMenu = (roles: string[]): TMenuConfig => [
	{
		title: 'Home',
		path: '/'
	},
	...(roles.includes('ADMIN') ? [
		{
			title: 'Admin Dashboard',
			path: '/admin'
		}
	] : []),
	...(roles.includes('AGENT') ? [
		{
			title: 'Agent Workspace',
			path: '/agent/workspace'
		}
	] : []),
	...(roles.includes('CUSTOMER') ? [
		{
			title: 'Support Center',
			path: '/support'
		}
	] : [])
];


export const MENU_ROOT: TMenuConfig = [
	{
		title: 'Public Profile',
		icon: 'profile-circle',
		rootPath: '/public-profile/',
		path: 'public-profile/profiles/default',
		childrenIndex: 2
	},
	{
		title: 'Account',
		icon: 'setting-2',
		rootPath: '/account/',
		path: '/',
		childrenIndex: 3
	},
	{
		title: 'Network',
		icon: 'users',
		rootPath: '/network/',
		path: 'network/get-started',
		childrenIndex: 4
	},
	{
		title: 'Authentication',
		icon: 'security-user',
		rootPath: '/authentication/',
		path: 'authentication/get-started',
		childrenIndex: 5
	}
];
