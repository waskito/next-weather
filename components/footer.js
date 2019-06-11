import Link from 'next/link'
import Alert from 'react-s-alert'
import PropTypes from 'prop-types'
import { i18n, Trans, withNamespaces } from '../i18n'

const now = new Date();
const Footer = ({ t }) => (
    <footer id="footer">
        <h4>footer</h4>
    </footer>

  )

Footer.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces('common')(Footer);