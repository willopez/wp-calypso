/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import page from 'page';
import { flowRight } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import { isJetpackSite } from 'state/sites/selectors';
import { isSiteAutomatedTransfer } from 'state/selectors';

const redirectNonJetpack = redirectRoute => WrappedComponent => {
	class RedirectNonJetpack extends Component {
		static propTypes = {
			redirectRoute: PropTypes.string,
			// Connected props
			siteIsAtomic: PropTypes.bool,
			siteIsJetpack: PropTypes.bool,
			siteSlug: PropTypes.string
		}

		componentDidMount() {
			this.redirectIfNoAccess();
		}

		componentDidUpdate() {
			this.redirectIfNoAccess();
		}

		redirectIfNoAccess() {
			if ( this.props.siteIsJetpack === false || this.props.siteIsAtomic ) {
				this.redirect();
			}
		}

		redirect = () => {
			const { siteSlug } = this.props;

			let route = '';
			if ( redirectRoute ) {
				const getSiteSlug = ( redirectRoute.split( '/' ) ).slice( -1 )[ 0 ];
				route = getSiteSlug ? redirectRoute : redirectRoute + siteSlug;
				page( route );
			} else {
				route = siteSlug ? '/settings/general/' + siteSlug : '/settings/general/';
				page( route );
			}
		};

		render() {
			return (
				<WrappedComponent
					redirect={ this.redirect }
					{ ...this.props }
				/>
			);
		}
	}
	const connectComponent = connect(
		( state ) => {
			const siteId = getSelectedSiteId( state );

			return {
				siteIsAtomic: isSiteAutomatedTransfer( state, siteId ),
				siteIsJetpack: isJetpackSite( state, siteId ),
				siteSlug: getSelectedSiteSlug( state ),
			};
		}
	);

	return flowRight(
		connectComponent,
		localize
	)( RedirectNonJetpack );
};

export default redirectNonJetpack;
