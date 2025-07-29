import React, { useRef, useState } from 'react';
import { Activity, Heart, Brain, Lock, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';


const SessionInfo = ({ healthcareContext, privacyStyle }) => {
  const contextConfigs = {
    'symptom checking': {
      label: 'Symptom Checking',
      icon: Activity,
      className: 'context-symptom',
      description: 'Symptom Checking: Helps you understand your symptoms, provides general health guidance, and suggests when to seek professional care.'
    },
    'mental health support': {
      label: 'Mental Health Support',
      icon: Brain,
      className: 'context-mental',
      description: 'Mental Health Support: Offers emotional support, stress management techniques, and guidance on when to seek professional help.'
    },
    'chronic care management': {
      label: 'Chronic Care Management',
      icon: Heart,
      className: 'context-chronic',
      description: 'Chronic Care Management: Supports you in managing chronic health conditions, medication adherence, and communication with providers.'
    }
  };

  const privacyConfigs = {
    'minimal': {
      label: 'Minimal Privacy',
      icon: Lock,
      className: 'privacy-minimal',
      description: 'Minimal Privacy: No personal identifiers are collected. Data is used only for service improvement and stored securely.'
    },
    'contextual': {
      label: 'Contextual Privacy',
      icon: Info,
      className: 'privacy-contextual',
      description: 'Contextual Privacy: Conversation data is used to provide better health guidance. Sensitive topics trigger extra privacy protections.'
    },
    'progressive': {
      label: 'Progressive Privacy',
      icon: AlertTriangle,
      className: 'privacy-progressive',
      description: 'Progressive Privacy: Comprehensive privacy information, data is encrypted, anonymized, and never shared with third parties.'
    }
  };

  const contextConfig = contextConfigs[healthcareContext];
  const privacyConfig = privacyConfigs[privacyStyle];
  const ContextIcon = contextConfig.icon;
  const PrivacyIcon = privacyConfig.icon;

  // Tooltip logic
  const [showContextTooltip, setShowContextTooltip] = useState(false);
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);
  const contextTimeout = useRef();
  const privacyTimeout = useRef();

  const handleContextMouseEnter = () => {
    contextTimeout.current = setTimeout(() => setShowContextTooltip(true), 1000);
  };
  const handleContextMouseLeave = () => {
    clearTimeout(contextTimeout.current);
    setShowContextTooltip(false);
  };
  const handlePrivacyMouseEnter = () => {
    privacyTimeout.current = setTimeout(() => setShowPrivacyTooltip(true), 1000);
  };
  const handlePrivacyMouseLeave = () => {
    clearTimeout(privacyTimeout.current);
    setShowPrivacyTooltip(false);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b border-gray-200 relative">
      <div
        className={cn("context-badge", contextConfig.className)}
        onMouseEnter={handleContextMouseEnter}
        onMouseLeave={handleContextMouseLeave}
        style={{ position: 'relative' }}
      >
        <ContextIcon className="w-3 h-3 mr-1" />
        {contextConfig.label}
        {showContextTooltip && (
          <div className="absolute z-50 left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow text-xs w-64" style={{top: '100%', zIndex: 9999}}>
            <span className="text-gray-900">{contextConfig.description}</span>
          </div>
        )}
      </div>

      <div
        className={cn("context-badge", privacyConfig.className)}
        onMouseEnter={handlePrivacyMouseEnter}
        onMouseLeave={handlePrivacyMouseLeave}
        style={{ position: 'relative' }}
      >
        <PrivacyIcon className="w-3 h-3 mr-1" />
        {privacyConfig.label}
        {showPrivacyTooltip && (
          <div className="absolute z-50 left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow text-xs w-64" style={{top: '100%', zIndex: 9999}}>
            <span className="text-gray-900">{privacyConfig.description}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-900 ml-auto self-center">
        Session active
      </div>
    </div>
  );
};

export default SessionInfo; 