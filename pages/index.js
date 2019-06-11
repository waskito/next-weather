import ButtonGeolocation from '../components/button-geolocation'
import { compose } from "redux"
import { connect } from 'react-redux'
import {
  first,
  get,
  isEmpty
} from 'lodash'
import { getCookie } from '../utils/cookies'
import Head from '../components/head'
import { i18n, withNamespaces } from '../i18n'
import { Link } from '../routes'
import moment from 'moment'
import numeral from '../utils/numeral'
import PropTypes from 'prop-types'
import React from 'react'
import noAuth from '../_hoc/noAuth'
import d2d from 'degrees-to-direction'
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
      <div className="row justify-content-center">
        <div className="col-md-auto col-lg-6">
          <h1 className="text-center">{t('current-weather')}</h1>
        </div>
      </div>
      {inBrowser &&
        <div className="row justify-content-center">
          <div className="col-md-auto col-lg-6">
            <ButtonGeolocation />
          </div>
        </div>
      }
      {!isEmpty(weather) &&
        <div className="row justify-content-center m-t-16">
          <div className="col-md-auto col-lg-6">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Location</td>
                  <td>{ get(weather, 'name') }</td>
                </tr>
                <tr>
                  <td>Cloudiness</td>
                  <td className="text-capitalize">
                    <span>{ get(first(get(weather, 'weather')), 'description') }</span>
                    <img src={`http://openweathermap.org/img/w/${get(first(get(weather, 'weather')), 'icon')}.png`} alt={get(first(get(weather, 'weather')), 'description')} height="24" width="24" />
                  </td>
                </tr>
                <tr>
                  <td>Wind</td>
                  <td>{ get(weather, 'wind.speed') } m/s, {d2d( get(weather, 'wind.deg') )}</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td>{ get(weather, 'main.pressure') } hpa</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{ get(weather, 'main.humidity') } %</td>
                </tr>
              </tbody>
            </table>
          </div>
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