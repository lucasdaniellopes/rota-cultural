import MapComponent from "@/components/MapComponent"
import styles from '@/styles/MapPage.module.css';

export default function MapPage() {
    return (
        <div className={styles['map-page-container']}>
         <MapComponent></MapComponent>
        </div>
    )
}