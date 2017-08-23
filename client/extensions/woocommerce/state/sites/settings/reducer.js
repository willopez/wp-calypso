/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import general from './general/reducer';
import products from './products/reducer';
import tax from './tax/reducer';
import email from './email/reducer';

export default combineReducers( {
	general,
	products,
	tax,
	email,
} );
