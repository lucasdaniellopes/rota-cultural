import MapComponent from "@/components/map/MapComponent"
import Header from "@/components/layout/Header"
import styles from './MapPage.module.css';

export default function MapPage() {
    return (
        <div className={styles['map-page-container']}>
            <Header />
            <MapComponent />
        </div>
    )
}