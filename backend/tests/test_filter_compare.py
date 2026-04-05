import unittest

from app.models import FilterPayload
from app.services.filter_compare import compare_coffees, filter_graph


class FilterCompareTests(unittest.TestCase):
    def test_filter_country_and_milk_none(self) -> None:
        payload = FilterPayload(
            countries=['italy'],
            milkLevel='none',
            milkRange=[0, 0],
            strength=[1, 5],
            volume=[20, 300],
            search='',
        )
        result = filter_graph(payload)
        self.assertGreaterEqual(len(result.nodes), 3)
        self.assertIn('espresso', result.nodes)
        self.assertNotIn('latte', result.nodes)

    def test_filter_search(self) -> None:
        payload = FilterPayload(
            countries=['italy', 'spain'],
            milkLevel='all',
            milkRange=[0, 100],
            strength=[1, 5],
            volume=[20, 300],
            search='cort',
        )
        result = filter_graph(payload)
        self.assertEqual(result.nodes, ['cortado'])

    def test_compare_returns_selected(self) -> None:
        result = compare_coffees(['espresso', 'cafe-con-leche'])
        ids = [item.id for item in result.items]
        self.assertEqual(len(ids), 2)
        self.assertIn('espresso', ids)
        self.assertIn('cafe-con-leche', ids)


if __name__ == '__main__':
    unittest.main()
