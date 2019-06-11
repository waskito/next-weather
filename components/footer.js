import Link from 'next/link'
import Alert from 'react-s-alert'
import PropTypes from 'prop-types'
import { i18n, Trans, withNamespaces } from '../i18n'

const now = new Date();
const Footer = ({ t }) => (
    <footer id="footer">
            <Trans i18nKey="common:footer.copyright"
                values={{
                    year: now.getFullYear(),
                    linkText: "Next Weather"
                }}
                components={[<span className="love" key="f.love"></span>]}
                />
            <span className="hide-fixed float-right pad-rgt">
                <a className="flag" onClick={() => { i18n.changeLanguage('en') }}>
                    <img src="/static/images/english.svg" alt="English" title="English" height="18" />
                </a>
                <a className="flag" onClick={() => { i18n.changeLanguage('id') }}>
                    <img src="/static/images/indonesia.svg" alt="Bahasa" title="Bahasa" height="18" />
                </a>
            </span>
    </footer>
)

Footer.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces('common')(Footer);