/**
 * External dependencies
 */
import { pick } from 'lodash';

/**
 * Internal dependencies
 */
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { http } from 'state/data-layer/wpcom-http/actions';
import { SECTION_SET, SELECTED_SITE_SET, JITM_SET } from 'state/action-types';

const process = {
	hasInitializedSites: false,
	hasInitializedSection: false,
	lastSection: null,
	lastSite: null,
};

export const handleProcessJITM = ( state, dispatch, action ) => {
	if ( ! process.hasInitializedSites || ! process.hasInitializedSection ) {
		return;
	}

	const currentSite = process.lastSite;

	console.log( 'getting jitm: ', process );

	dispatch( http( {
		apiNamespace: 'wpcom',
		method: 'GET',
		path: `/v2/sites/${ currentSite }/jitm/calypso:${ process.lastSection }:admin_notices`,
		query: {
			external_user_id: '1',
			user_roles: 'administrator',
			query_string: '',
		}
	}, action ) );
};

export const handleRouteChange = ( { getState, dispatch }, action ) => {
	switch ( action.isLoading ) {
		case false:
			process.hasInitializedSection = true;
			return;
		case true:
			process.hasInitializedSection = false;
			return;
	}

	process.lastSection = action.section.name;

	console.log( 'changed route: ', action );

	handleProcessJITM( getState(), dispatch, action );
};

export const handleSiteSelection = ( { getState, dispatch }, action ) => {
	console.log( 'selected site: ', action );

	process.hasInitializedSites = !! action.siteId;
	process.lastSite = action.siteId;

	handleProcessJITM( getState(), dispatch, action );
};

export const receiveJITM = ( { dispatch }, { siteId }, data ) => {
	console.log( 'received data', data );
	dispatch( {
		type: JITM_SET,
		jitms: data,
	} );
};

export const failedJITM = () => {
	console.log( 'failed jitm' );
};

export default {
	[ SECTION_SET ]: [
		dispatchRequest(
			handleRouteChange,
			receiveJITM,
			failedJITM
		)
	],
	[ SELECTED_SITE_SET ]: [
		dispatchRequest(
			handleSiteSelection,
			receiveJITM,
			failedJITM
		)
	],
};
