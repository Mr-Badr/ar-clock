'use client';

import { useEffect, useMemo, useState } from 'react';
import { Compass, Smartphone } from 'lucide-react';
import styles from './QiblaCompass.module.css';

const SENSOR_STATUS = {
  idle: 'idle',
  listening: 'listening',
  denied: 'denied',
  unsupported: 'unsupported',
};

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function getSignedTurn(degrees) {
  return ((degrees + 540) % 360) - 180;
}

function getHeadingFromEvent(event) {
  if (typeof event.webkitCompassHeading === 'number' && Number.isFinite(event.webkitCompassHeading)) {
    return normalizeDegrees(event.webkitCompassHeading);
  }

  if (typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
    return normalizeDegrees(360 - event.alpha);
  }

  return null;
}

function buildTurnInstruction(turnDegrees) {
  if (!Number.isFinite(turnDegrees)) {
    return 'فعّل بوصلة الهاتف ثم حرّك الجهاز بهدوء حتى يظهر اتجاه القبلة الحي.';
  }

  const absoluteTurn = Math.abs(turnDegrees);

  if (absoluteTurn <= 8) {
    return 'أنت قريب جداً من اتجاه القبلة حسب حساسات هذا الهاتف.';
  }

  const direction = turnDegrees > 0 ? 'يميناً' : 'يساراً';
  return `لف الهاتف ${direction} بنحو ${Math.round(absoluteTurn)}° حتى يتطابق السهم مع اتجاه القبلة.`;
}

function buildStatusText(sensorStatus, heading, turnDegrees) {
  if (sensorStatus === SENSOR_STATUS.unsupported) {
    return 'هذا المتصفح لا يتيح قراءة بوصلة الجهاز. استخدم الدرجة المعروضة أو افتح الصفحة من هاتف يدعم حساسات الاتجاه.';
  }

  if (sensorStatus === SENSOR_STATUS.denied) {
    return 'لم يتم منح إذن البوصلة. يمكنك السماح بحساسات الحركة من إعدادات المتصفح ثم إعادة المحاولة.';
  }

  if (sensorStatus === SENSOR_STATUS.listening && Number.isFinite(heading)) {
    return buildTurnInstruction(turnDegrees);
  }

  if (sensorStatus === SENSOR_STATUS.listening) {
    return 'تم تشغيل الاستماع لحساسات الهاتف. حرّك الجهاز حركة بسيطة حتى تصل أول قراءة من البوصلة.';
  }

  return 'على الهاتف، اضغط زر تفعيل البوصلة للحصول على سهم حي يعتمد على اتجاه الجهاز.';
}

export default function QiblaCompass({
  bearingDegrees,
  bearingLabel,
  cityNameAr,
  countryNameAr,
}) {
  const safeBearing = Number.isFinite(bearingDegrees)
    ? normalizeDegrees(bearingDegrees)
    : null;
  const [heading, setHeading] = useState(null);
  const [sensorStatus, setSensorStatus] = useState(SENSOR_STATUS.idle);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening || safeBearing === null) {
      return undefined;
    }

    const handleOrientation = (event) => {
      const nextHeading = getHeadingFromEvent(event);
      if (nextHeading !== null) {
        setHeading(nextHeading);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isListening, safeBearing]);

  const turnDegrees = useMemo(() => {
    if (safeBearing === null || !Number.isFinite(heading)) {
      return safeBearing;
    }

    return normalizeDegrees(safeBearing - heading);
  }, [heading, safeBearing]);

  const signedTurn = getSignedTurn(turnDegrees ?? 0);
  const instruction = buildStatusText(sensorStatus, heading, signedTurn);
  const displayedBearingLabel = bearingLabel || (safeBearing === null ? '' : `${Math.round(safeBearing)}°`);
  const compassStyle = {
    '--qibla-rotation': `${turnDegrees ?? safeBearing ?? 0}deg`,
  };

  async function startCompass() {
    if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') {
      setSensorStatus(SENSOR_STATUS.unsupported);
      return;
    }

    const OrientationEvent = window.DeviceOrientationEvent;

    if (typeof OrientationEvent.requestPermission === 'function') {
      try {
        const permission = await OrientationEvent.requestPermission();
        if (permission !== 'granted') {
          setSensorStatus(SENSOR_STATUS.denied);
          return;
        }
      } catch {
        setSensorStatus(SENSOR_STATUS.denied);
        return;
      }
    }

    setSensorStatus(SENSOR_STATUS.listening);
    setIsListening(true);
  }

  if (safeBearing === null) {
    return null;
  }

  return (
    <div className={styles.qiblaShell}>
      <div className={styles.qiblaHeader}>
        <span className={styles.qiblaKicker}>اتجاه القبلة</span>
        <h3 className={styles.qiblaTitle}>اتجاه القبلة من {cityNameAr}</h3>
        <p className={styles.qiblaCopy}>
          القبلة من {cityNameAr}{countryNameAr ? `، ${countryNameAr}` : ''} تقع عند{' '}
          <strong dir="ltr">{displayedBearingLabel}</strong> من الشمال الحقيقي. على الهاتف يمكنك تفعيل البوصلة الحية، وعلى سطح المكتب تعتمد على الدرجة المعروضة.
        </p>
      </div>

      <div className={styles.qiblaBody}>
        <div className={styles.dialWrap} aria-hidden="true">
          <div className={styles.dial}>
            <span className={`${styles.marker} ${styles.markerNorth}`}>N</span>
            <span className={`${styles.marker} ${styles.markerEast}`}>E</span>
            <span className={`${styles.marker} ${styles.markerSouth}`}>S</span>
            <span className={`${styles.marker} ${styles.markerWest}`}>W</span>
            <span className={styles.qiblaNeedle} style={compassStyle} />
            <span className={styles.centerPin}>
              <Compass size={16} aria-hidden />
              قبلة
            </span>
          </div>
        </div>

        <div className={styles.qiblaMeta}>
          <p className={styles.bearingLine}>
            الدرجة:
            <strong className={styles.bearingValue}>{displayedBearingLabel}</strong>
          </p>
          <p className={styles.statusText}>{instruction}</p>

          <div className={styles.mobileControls}>
            <button type="button" className={styles.sensorButton} onClick={startCompass}>
              تفعيل بوصلة الهاتف
            </button>
          </div>

          <div className={styles.mobileAdvice}>
            <p className={styles.adviceTitle}>
              <Smartphone size={16} aria-hidden /> أفضل نتيجة على الهاتف
            </p>
            <p className={styles.qiblaNote}>
              أمسك الهاتف بشكل مستوٍ، ابتعد عن المعادن والمغناطيس، ثم لف الجهاز ببطء حتى يتجه السهم إلى القبلة.
            </p>
          </div>

          <div className={styles.desktopAdvice}>
            <p className={styles.adviceTitle}>
              <Smartphone size={16} aria-hidden /> استخدم الهاتف للقبلة الحية
            </p>
            <p className={styles.qiblaNote}>
              على سطح المكتب نعرض الدرجة الدقيقة من الإحداثيات. للحصول على تجربة بوصلة عملية، افتح نفس الصفحة من الهاتف.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
