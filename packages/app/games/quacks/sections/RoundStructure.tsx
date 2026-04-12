import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { RichText } from '../../../components/RichText';

interface StepConfig {
    num: number;
    titleKey: string;
    contentKeys: string[];
}

const steps: StepConfig[] = [
    {
        num: 1,
        titleKey: 'roundStructure.stepOne.title',
        contentKeys: ['roundStructure.stepOne.passClockwise'],
    },
    {
        num: 2,
        titleKey: 'roundStructure.stepTwo.title',
        contentKeys: [
            'roundStructure.stepTwo.drawFortuneTellerCard',
            'roundStructure.stepTwo.purpleCards',
            'roundStructure.stepTwo.blueCards',
            'roundStructure.stepTwo.note',
        ],
    },
    {
        num: 3,
        titleKey: 'roundStructure.stepThree.title',
        contentKeys: ['roundStructure.stepThree.drawTokens'],
    },
];

interface SubSectionConfig {
    titleKey: string;
    contentKeys: string[];
}

const stepThreeSubSections: SubSectionConfig[] = [
    {
        titleKey: 'roundStructure.stepThree.placement.title',
        contentKeys: ['roundStructure.stepThree.placement.tokenAdvancement'],
    },
    {
        titleKey: 'roundStructure.stepThree.stopping.title',
        contentKeys: ['roundStructure.stepThree.stopping.voluntaryStop'],
    },
    {
        titleKey: 'roundStructure.stepThree.exploding.title',
        contentKeys: ['roundStructure.stepThree.exploding.exploded'],
    },
    {
        titleKey: 'roundStructure.stepThree.rules.title',
        contentKeys: [
            'roundStructure.stepThree.rules.doNotLookInBag',
            'roundStructure.stepThree.rules.flaskUsage',
        ],
    },
];

/**
 * Round Structure section — renders numbered step lists with circular
 * step-number badges and sub-sections for the drawing phase.
 */
export function RoundStructure() {
    const { t } = useTranslation('quacks');
    const theme = useTheme();

    return (
        <View>
            <Text
                style={[
                    styles.heading,
                    { color: theme.colors.accent, fontFamily: theme.fonts.heading },
                ]}
            >
                {t('roundStructure.title')}
            </Text>

            {steps.map(step => (
                <View
                    key={step.num}
                    style={[
                        styles.stepContainer,
                        {
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border ?? '#4a2d6e',
                        },
                    ]}
                >
                    {/* Circular step badge */}
                    <View style={styles.stepHeader}>
                        <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
                            <Text style={styles.badgeText}>{step.num}</Text>
                        </View>
                        <Text
                            style={[
                                styles.stepTitle,
                                { color: theme.colors.text, fontFamily: theme.fonts.heading },
                            ]}
                        >
                            {t(step.titleKey)}
                        </Text>
                    </View>

                    {/* Step content */}
                    {step.contentKeys.map((key, i) => (
                        <View key={i} style={styles.contentItem}>
                            <RichText
                                value={t(key)}
                                style={{ color: theme.colors.text, fontSize: 14, lineHeight: 22 }}
                            />
                        </View>
                    ))}

                    {/* Sub-sections for step 3 */}
                    {step.num === 3 &&
                        stepThreeSubSections.map((sub, si) => (
                            <View
                                key={si}
                                style={[
                                    styles.subSection,
                                    { borderLeftColor: theme.colors.accent },
                                ]}
                            >
                                <Text style={[styles.subTitle, { color: theme.colors.accent }]}>
                                    {t(sub.titleKey)}
                                </Text>
                                {sub.contentKeys.map((key, ci) => (
                                    <RichText
                                        key={ci}
                                        value={t(key)}
                                        style={{
                                            color: theme.colors.text,
                                            fontSize: 14,
                                            lineHeight: 22,
                                            marginTop: ci > 0 ? 6 : 0,
                                        }}
                                    />
                                ))}
                            </View>
                        ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    stepContainer: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    badge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    badgeText: {
        color: '#1a0e2e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepTitle: {
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
    },
    contentItem: {
        marginBottom: 6,
        paddingLeft: 40,
    },
    subSection: {
        marginTop: 10,
        marginLeft: 40,
        borderLeftWidth: 4,
        paddingLeft: 12,
        paddingVertical: 8,
    },
    subTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
});
