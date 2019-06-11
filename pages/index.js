import ButtonGeolocation from '../components/button-geolocation'
import { compose } from "redux"
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { getCookie } from '../utils/cookies'
import Head from '../components/head'
import { i18n, withNamespaces } from '../i18n'
import { Link } from '../routes'
import numeral from '../utils/numeral'
import PropTypes from 'prop-types'
import React from 'react'
import noAuth from '../_hoc/noAuth'
import {
  myIp,
  saveLocation,
  setLocation,
  setLocationByIpAddress,
  getWeatherByLatLng
} from '../stores/actions'


class Index extends React.Component {
  static async getInitialProps({store, req}) {
    const currentState = store.getState();
    const coordsFromCookie = getCookie("__nw", req) || null;

    if ((!coordsFromCookie || (coordsFromCookie && coordsFromCookie.provider == 'ip-address')) && !get(currentState, 'myip.loaded') ){
      const resMyIp = await store.dispatch(myIp());
      if ( get(resMyIp, 'data.ip') ) {
        const resLocation = await store.dispatch(setLocationByIpAddress( get( resMyIp, 'data.ip' ) ))

        if ( !isEmpty(get(resLocation,'data')) ) {
          const lat = get(resLocation,'data.latitude');
          const lng = get(resLocation,'data.longitude');

          store.dispatch(saveLocation(lat, lng, 'ip-address'));
          await store.dispatch(getWeatherByLatLng( lat, lng ));
        }

      }
    }

    if (coordsFromCookie) {
      await store.dispatch(getWeatherByLatLng( coordsFromCookie.latitude, coordsFromCookie.longitude ));
    }

    return {
      namespacesRequired: ['common']
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      inBrowser: false
    }
  }

  componentDidMount() {
    this.setState({ inBrowser: true });
  }

render() {
  const {
    t,
    weather
  } = this.props;

  const {
    inBrowser
  } = this.state;
  return (
    <main>
      <Head title={`${t('current-weather')} | ${t('title')}`} />
      <h1>{t('current-weather')}</h1>
      {inBrowser &&
        <ButtonGeolocation />
      }
      {!isEmpty(weather) &&
        <div>
          {JSON.stringify(weather)}
        </div>
      }
    </main>
  )
}
}

const mapStateToProps = (state) => ({
  weather: state.weather.data
})

export default compose(
  connect(mapStateToProps),
  withNamespaces(['common']),
  noAuth()
)(Index);