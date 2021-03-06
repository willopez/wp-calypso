/**
 * External dependencies
 */
import React, { Component } from 'react';

class VerticalNav extends Component {
	render() {
		return (
			<div className="vertical-nav">
				{ this.props.children }
			</div>
		);
	}
}

export default VerticalNav;
