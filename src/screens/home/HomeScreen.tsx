import { StyleSheet, Text, View } from 'react-native';
import { PixelIcon } from '../../components/pixel-icon';
import { TabBar } from '../../components/tab-bar/tab-bar';
import {
  border,
  color,
  fontFamily,
  fontSize,
  iconSize,
  letterSpacing,
  space,
} from '../../theme';
import { formatBRL, homeMock } from './home-mock';

export function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.title}>SEMUMREAL</Text>
        <Text style={styles.subtitle}>CONTROLE FINANCEIRO</Text>

        <View style={styles.card}>
          <View style={[styles.corner, styles.cornerTl]} />
          <View style={[styles.corner, styles.cornerTr]} />
          <View style={[styles.corner, styles.cornerBl]} />
          <View style={[styles.corner, styles.cornerBr]} />

          <Text style={styles.cardTitle}>RESUMO DA CONTA</Text>

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>TOTAL GASTOS MENSAIS</Text>
            <View style={styles.metricRow}>
              <PixelIcon name="calendar" size={iconSize.md} fill={color.paper} />
              <Text style={styles.metricValue}>{formatBRL(homeMock.monthlyExpenses)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>TOTAL GERAL</Text>
            <View style={styles.metricRow}>
              <PixelIcon name="coins" size={iconSize.md} fill={color.paper} />
              <Text style={styles.metricValue}>{formatBRL(homeMock.generalTotal)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>TRANSAÇÕES RECENTES</Text>

        {homeMock.transactions.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <PixelIcon name={tx.icon} size={iconSize.md} />
            <Text style={styles.txText} numberOfLines={1}>
              {tx.date} | {tx.description} | {formatBRL(tx.amount)}
            </Text>
          </View>
        ))}
      </View>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.paper,
  },
  body: {
    flex: 1,
    paddingHorizontal: space[3],
    paddingTop: space[2],
  },
  title: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.md,
    color: color.ink,
    letterSpacing: letterSpacing.wide,
    marginBottom: space[1],
  },
  subtitle: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.muted,
    letterSpacing: letterSpacing.tight,
    marginBottom: space[3],
  },
  card: {
    backgroundColor: color.panel,
    borderWidth: border.thick,
    borderColor: color.paper,
    padding: space[2],
    marginBottom: space[3],
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: color.paper,
  },
  cornerTl: { top: -2, left: -2 },
  cornerTr: { top: -2, right: -2 },
  cornerBl: { bottom: -2, left: -2 },
  cornerBr: { bottom: -2, right: -2 },
  cardTitle: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.paper,
    textAlign: 'center',
    letterSpacing: letterSpacing.wide,
    marginBottom: space[2],
  },
  metric: {
    gap: space[1],
  },
  metricLabel: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.paper,
    letterSpacing: letterSpacing.tight,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  metricValue: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.sm,
    color: color.paper,
    letterSpacing: letterSpacing.wide,
  },
  divider: {
    height: 2,
    borderStyle: 'dashed',
    borderBottomWidth: 2,
    borderColor: color.paper,
    marginVertical: space[2],
  },
  sectionTitle: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.ink,
    letterSpacing: letterSpacing.wide,
    marginBottom: space[2],
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginBottom: space[2],
  },
  txText: {
    flex: 1,
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.ink,
    letterSpacing: letterSpacing.tight,
  },
});
