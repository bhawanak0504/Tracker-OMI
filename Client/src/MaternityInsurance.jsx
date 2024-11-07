import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MaternityInsurance.css';
import { 
  faArrowLeft, 
  faBell, 
  faHome, 
  faCalendar, 
  faHeartbeat, 
  faUser, 
  faPhotoVideo, 
  faMagnifyingGlass,
  faMapMarkerAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import UploadDocuments from './UploadDocuments';
import EligibilityCheck from './EligibilityCheck';
import Cashless from './Cashless';
import image1 from './assets/cashless.png';
import image2 from './assets/consultatin.png';
import image3 from './assets/delivery.png';
import image4 from './assets/main.png';
import image5 from './assets/med.png';
import CheckPlans from './CheckPlans';

// Fix for leaflet's default icon not showing in builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for government and private hospitals
const governmentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const privateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hospitals = [
  {
    position: [26.9124, 75.7873],
    name: 'SMS Hospital, Jaipur',
    type: 'Government Center',
    address: 'Jawahar Lal Nehru Marg, Jaipur, Rajasthan 302004',
    contact: '+91-141-2560291',
    services: ['Emergency Care', 'Surgery', 'Cardiology', 'Oncology', 'Maternity Care'],
    website: 'http://www.education.rajasthan.gov.in/smsmcjaipur',
    openingHours: '24/7',
    maternityInsurance: 'Government schemes like Janani Suraksha Yojana cover maternity services.',
  },
  {
    position: [27.1558, 75.8122],
    name: 'Fortis Escorts Hospital, Jaipur',
    type: 'Private Hospital',
    address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017',
    contact: '+91-141-2547000',
    services: ['Emergency Care', 'Surgery', 'Orthopedics', 'Cardiology', 'Maternity Care'],
    website: 'https://www.fortishealthcare.com/india/fortis-escorts-hospital-jaipur-rajasthan',
    openingHours: '24/7',
    maternityInsurance: 'Cashless facility for maternity services under various private insurance schemes.',
  },
  {
    position: [26.2501, 73.0158],
    name: 'AIIMS, Jodhpur',
    type: 'Government Center',
    address: 'Basni Industrial Area, Phase-2, Jodhpur, Rajasthan 342005',
    contact: '+91-291-2740741',
    services: ['Emergency Care', 'Pediatrics', 'Surgery', 'Cardiology', 'Maternity Care'],
    website: 'https://www.aiimsjodhpur.edu.in/',
    openingHours: '24/7',
    maternityInsurance: 'Government schemes like Ayushman Bharat cover maternity services.',
  },
  {
    position: [24.5926, 73.7125],
    name: 'Geetanjali Medical College & Hospital, Udaipur',
    type: 'Private Hospital',
    address: 'Manwa Khera NH-8 Bypass, Udaipur, Rajasthan 313001',
    contact: '+91-294-2506000',
    services: ['Emergency Care', 'Cardiology', 'Neurosurgery', 'Oncology', 'Maternity Care'],
    website: 'https://www.geetanjaliuniversity.com/',
    openingHours: '24/7',
    maternityInsurance: 'Cashless treatment available under private insurance policies for maternity.',
  },
  {
    position: [26.2173, 73.0095],
    name: 'Mathuradas Mathur Hospital, Jodhpur',
    type: 'Government Center',
    address: 'Shastri Nagar, Jodhpur, Rajasthan 342003',
    contact: '+91-291-2433400',
    services: ['Emergency Care', 'General Surgery', 'Maternity Care', 'Pediatrics', 'Orthopedics'],
    website: 'https://www.rajasthan.gov.in/health/jodhpur',
    openingHours: '24/7',
    maternityInsurance: 'Government schemes cover maternity services like JSY and PMMVY.',
  },
  {
    position: [26.8887, 75.8175],
    name: 'Narayana Multispeciality Hospital, Jaipur',
    type: 'Private Hospital',
    address: 'Sector 28, Kumbha Marg, Pratap Nagar, Jaipur, Rajasthan 302033',
    contact: '+91-141-7120222',
    services: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Maternity Care'],
    website: 'https://www.narayanahealth.org/hospitals/jaipur/narayana-multispeciality-hospital',
    openingHours: '24/7',
    maternityInsurance: 'Cashless facility available for maternity under several private insurance plans.',
  },
  {
    position: [25.1867, 75.8586],
    name: 'Kota Heart Hospital, Kota',
    type: 'Private Hospital',
    address: 'Opposite Dadabari Bus Stand, Kota, Rajasthan 324009',
    contact: '+91-744-2501100',
    services: ['Emergency Care', 'Cardiology', 'Surgery', 'Maternity Care'],
    website: 'https://www.kotahearthospital.com/',
    openingHours: '24/7',
    maternityInsurance: 'Cashless treatment under private insurance policies for maternity care.',
  },
  {
    position: [25.3960, 74.6395],
    name: 'Jawaharlal Nehru Hospital, Ajmer',
    type: 'Government Center',
    address: 'Civil Lines, Ajmer, Rajasthan 305001',
    contact: '+91-145-2621555',
    services: ['Emergency Care', 'General Surgery', 'Pediatrics', 'Maternity Care'],
    website: 'https://www.ajmer.rajasthan.gov.in/',
    openingHours: '24/7',
    maternityInsurance: 'Government insurance schemes cover maternity services.',
  },
  {
    position: [27.2121, 77.4977],
    name: 'Shri Ram Hospital, Bharatpur',
    type: 'Private Hospital',
    address: 'NH-11, Jaipur Agra Highway, Bharatpur, Rajasthan 321001',
    contact: '+91-5644-220143',
    services: ['Emergency Care', 'Maternity Care', 'Pediatrics', 'General Surgery'],
    website: 'https://www.shriramhospital.in/',
    openingHours: '24/7',
    maternityInsurance: 'Private insurance schemes for cashless maternity treatment.',
  },
  {
    position: [26.8889, 75.8069],
    name: 'Jaipur Golden Hospital, Jaipur',
    type: 'Private Hospital',
    address: 'Near Vidhan Sabha, Lal Kothi, Jaipur, Rajasthan 302015',
    contact: '+91-141-2741234',
    services: ['Emergency Care', 'Neurology', 'Cardiology', 'Maternity Care'],
    website: 'https://www.jaipurgoldenhospital.com/',
    openingHours: '24/7',
    maternityInsurance: 'Private insurance schemes support cashless maternity services.',
  },
  {
    position: [27.0631, 74.9428],
    name: 'PBM Hospital, Bikaner',
    type: 'Government Center',
    address: 'PBM Hospital Campus, Bikaner, Rajasthan 334001',
    contact: '+91-151-2201590',
    services: ['Emergency Care', 'General Surgery', 'Pediatrics', 'Maternity Care'],
    website: 'https://www.education.rajasthan.gov.in/content/raj/education/pbmhospital-bikaner/en/home.html',
    openingHours: '24/7',
    maternityInsurance: 'Covered under government maternity schemes like JSY and PMMVY.',
  },
  {
    position: [26.4499, 74.6395],
    name: 'Mittal Hospital, Ajmer',
    type: 'Private Hospital',
    address: 'Pushkar Bypass, Near Vaishali Nagar, Ajmer, Rajasthan 305001',
    contact: '+91-145-2660401',
    services: ['Emergency Care', 'Cardiology', 'Neurology', 'Maternity Care'],
    website: 'https://www.mittalhospital.com/',
    openingHours: '24/7',
    maternityInsurance: 'Private insurance covers maternity care with cashless services.',
  },
  {
    position: [26.4751, 74.6463],
    name: 'MBS Hospital, Kota',
    type: 'Government Center',
    address: 'Chawani Chauraha, Station Road, Kota, Rajasthan 324001',
    contact: '+91-744-2325225',
    services: ['Emergency Care', 'General Surgery', 'Pediatrics', 'Maternity Care'],
    website: 'https://www.kota.rajasthan.gov.in/',
    openingHours: '24/7',
    maternityInsurance: 'Maternity services covered under JSY and Ayushman Bharat schemes.',
  },
  {
    position: [27.2003, 77.4910],
    name: 'Zanana Hospital, Bharatpur',
    type: 'Government Center',
    address: 'Mathura Gate, Bharatpur, Rajasthan 321001',
    contact: '+91-5644-222345',
    services: ['Pediatrics', 'Maternity Care', 'General Surgery', 'Emergency Care'],
    website: 'https://bharatpur.rajasthan.gov.in/',
    openingHours: '24/7',
    maternityInsurance: 'Government schemes like PMMVY cover maternity services.',
  },
  {
    position: [26.1433, 73.0125],
    name: 'Medipulse Hospital, Jodhpur',
    type: 'Private Hospital',
    address: 'Sector 17, Residency Road, Jodhpur, Rajasthan 342003',
    contact: '+91-291-2788999',
    services: ['Emergency Care', 'Cardiology', 'Orthopedics', 'Maternity Care'],
    website: 'https://www.medipulse.in/',
    openingHours: '24/7',
    maternityInsurance: 'Maternity services covered under various private insurance plans.',
  },
  {
    position: [24.5792, 73.6873],
    name: 'Maharana Bhupal Hospital, Udaipur',
    type: 'Government Center',
    address: 'Lake Palace Road, Udaipur, Rajasthan 313001',
    contact: '+91-294-2522519',
    services: ['Emergency Care', 'General Surgery', 'Pediatrics', 'Maternity Care'],
    website: 'https://www.udaipur.rajasthan.gov.in/',
    openingHours: '24/7',
    maternityInsurance: 'Government schemes like JSY and Ayushman Bharat cover maternity services.',
  },
  {
    position: [26.8822, 75.8176],
    name: 'Apollo Spectra Hospital, Jaipur',
    type: 'Private Hospital',
    address: 'Tonk Road, Near Gopalpura Bypass, Jaipur, Rajasthan 302018',
    contact: '+91-141-2550055',
    services: ['Surgery', 'Orthopedics', 'Maternity Care', 'Emergency Care'],
    website: 'https://www.apollospectra.com/jaipur',
    openingHours: '24/7',
    maternityInsurance: 'Cashless maternity services available under various private insurance plans.',
  },
  {
    position: [26.1542, 73.0084],
    name: 'Goyal Hospital, Jodhpur',
    type: 'Private Hospital',
    address: 'Pal Road, Near Saras Dairy, Jodhpur, Rajasthan 342008',
    contact: '+91-291-2612222',
    services: ['Emergency Care', 'Cardiology', 'Maternity Care', 'Neurosurgery'],
    website: 'https://www.goyalhospital.com/',
    openingHours: '24/7',
    maternityInsurance: 'Cashless facility available for maternity services under private insurance.',
  },
  {
    position: [26.2445, 73.0225],
    name: 'Mathuradas Mathur Hospital, Jodhpur',
    type: 'Government Center',
    address: 'Shastri Nagar, Jodhpur, Rajasthan 342003',
    contact: '+91-291-2433313',
    services: ['Emergency Care', 'Maternity Care', 'Orthopedics', 'Pediatrics'],
    website: 'https://www.rajasthan.gov.in/health/jodhpur',
    openingHours: '24/7',
    maternityInsurance: 'Government maternity schemes like JSY and PMMVY cover services.',
  },
];

const InsuranceOverview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

const handleSearchClick = () => {
  setIsOverlayOpen(true);
};

const handleCloseOverlay = () => {
  setIsOverlayOpen(false);
};


  return (
    <div className="insurance-container">
      <div className="insurance-header">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back-arrow" 
          onClick={handleBackClick}  
        />
        <h2 className="centered-title">Maternity Insurance</h2>
        
      </div>
      <div className="tag-line">Secure your peace of mind with Maternity Insurance</div>
      <div className="features">
        <div className="feature-1">
          <img src={image3} alt="Delivery & Hospitalization Costs" width="180" />
          <div className="feature-item">Delivery & Hospitalization Costs</div>
        </div>
        <div className="feature-2">
          <img src={image5} alt="Pre & Postnatal care, Newborn Support" width="180" />
          <div className="feature-item">Pre & Postnatal care & Newborn support</div>
        </div>
        <div className="feature-3">
          <img src={image1} alt="Pre & Postnatal care, Newborn Support" width="180" />
          <div className="feature-item">Cashless Treatment using health cards</div>
        </div>
        <div className="feature-4">
          <img src={image2} alt="Free Virtual Consultation" width="150" />
          <div className="feature-item">Free Virtual Consultation <br/>& Chat</div>
        </div>
        <div className="main">
          <img src={image4} alt="main" />
        </div>
      </div>

      <div className="action-header">Apply For Insurance</div>

<div className="actions">
  <UploadDocuments showModal={showModal} toggleModal={toggleModal} />
  <EligibilityCheck />
  <CheckPlans />
  <Cashless />
</div>



{ <div className="mainmap">
  <div className="map-heading">Search For Insurance</div>
  <div className="search-bar">
    <input 
      type="text" 
      placeholder="Search Nearby Location" 
      value={searchQuery} 
      onChange={handleSearchChange}
    />
    <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-magnifying-glass" />
  </div>
  <div className="type">
    <ul>
      <li>
        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red', marginRight: '5px' }} />
        Government Hospital
      </li>
      <li>
        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'green', marginRight: '5px' }} />
        Private Hospital
      </li>
    </ul>
  </div>


  <MapContainer
          center={[27.0238, 74.2179]}
          zoom={8}
          style={{ height: '500px', width: '80%', right: '14px', bottom: '90px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={hospital.position}
              icon={hospital.type === 'Government Center' ? governmentIcon : privateIcon}
            >
              <Popup>
                <strong>{hospital.name}</strong> <br />
                <em>{hospital.type}</em> <br />
                <p>{hospital.address}</p>
                <p>Contact: {hospital.contact}</p>
                <p>Opening Hours: {hospital.openingHours}</p>
                <p>Services: {hospital.services.join(', ')}</p>
                <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {isOverlayOpen && (
      <div className="fullscreen-overlay">
        <div className="overlay-content">
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={handleCloseOverlay} />
          <input 
            type="text" 
            placeholder="Search for Insurance Providers" 
            value={searchQuery} 
            onChange={handleSearchChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>)}

      
  </div> }

      <footer className="footer">
        <button className="footer-btn active-icon">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faHeartbeat} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faPhotoVideo} />
        </button>
      </footer>
    </div>
  );
};

export default InsuranceOverview;