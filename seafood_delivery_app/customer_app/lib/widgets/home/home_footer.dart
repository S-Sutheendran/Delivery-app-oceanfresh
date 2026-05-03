import 'package:flutter/material.dart';
import '../../config/theme.dart';

class HomeFooter extends StatelessWidget {
  const HomeFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF1A2332),
      padding: const EdgeInsets.fromLTRB(20, 32, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildBrand(context),
          const SizedBox(height: 24),
          const Divider(color: Colors.white12),
          const SizedBox(height: 20),
          _buildLinksRow(context),
          const SizedBox(height: 20),
          const Divider(color: Colors.white12),
          const SizedBox(height: 16),
          _buildFeatureRow(),
          const SizedBox(height: 20),
          const Divider(color: Colors.white12),
          const SizedBox(height: 12),
          _buildCopyright(context),
        ],
      ),
    );
  }

  Widget _buildBrand(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppTheme.primary, AppTheme.accent],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.waves_rounded, color: Colors.white, size: 22),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'OceanFresh',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w700),
            ),
            Text(
              'Fresh Seafood, Delivered Fast',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 11),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLinksRow(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: _footerColumn('Quick Links', [
            'Home',
            'Best Sellers',
            'Categories',
            'Seasonal Picks',
            'Track Order',
          ]),
        ),
        Expanded(
          child: _footerColumn('Help & Support', [
            'FAQs',
            'Contact Us',
            'Return Policy',
            'Shipping Info',
            'Privacy Policy',
          ]),
        ),
        Expanded(
          child: _footerColumn('Company', [
            'About Us',
            'Blog',
            'Careers',
            'Partner With Us',
            'Terms of Use',
          ]),
        ),
      ],
    );
  }

  Widget _footerColumn(String title, List<String> links) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13),
        ),
        const SizedBox(height: 10),
        ...links.map(
          (l) => Padding(
            padding: const EdgeInsets.only(bottom: 7),
            child: Text(
              l,
              style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 11,
                  fontWeight: FontWeight.w400),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureRow() {
    final features = [
      (Icons.local_shipping_outlined, 'Free Delivery', 'Above â‚¹500'),
      (Icons.access_time_rounded, '30-45 min', 'Express Delivery'),
      (Icons.verified_rounded, '100% Fresh', 'Quality Assured'),
      (Icons.support_agent_rounded, '24/7 Support', 'Always Here'),
    ];
    return Wrap(
      spacing: 16,
      runSpacing: 12,
      children: features
          .map(
            (f) => SizedBox(
              width: 140,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(f.$1, size: 18, color: AppTheme.accent),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(f.$2,
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 12)),
                      Text(f.$3,
                          style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.5),
                              fontSize: 10)),
                    ],
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildCopyright(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _socialBtn(Icons.language_rounded, '#'),
            const SizedBox(width: 12),
            _socialBtn(Icons.facebook_rounded, '#'),
            const SizedBox(width: 12),
            _socialBtn(Icons.chat_bubble_rounded, '#'),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          'Â© ${DateTime.now().year} OceanFresh. All rights reserved.',
          style: TextStyle(
              color: Colors.white.withValues(alpha: 0.4),
              fontSize: 11),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _socialBtn(IconData icon, String url) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(icon, color: Colors.white60, size: 18),
    );
  }
}
