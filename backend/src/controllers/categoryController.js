import { Category } from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { user: req.user.id, isArchived: false };

    if (type === "income" || type === "expense") {
      query.type = type;
    }

    const categories = await Category.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ type: 1, name: 1 });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories.", error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { type, name, color, icon } = req.body;

    if (!type || !name) {
      return res.status(400).json({ message: "Type and name are required." });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid category type." });
    }

    const trimmedName = String(name).trim();
    if (!trimmedName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({
      user: req.user.id,
      type,
      name: trimmedName,
    }).collation({ locale: "en", strength: 2 });

    if (existingCategory && !existingCategory.isArchived) {
      return res.status(409).json({ message: "Category already exists." });
    }

    if (existingCategory && existingCategory.isArchived) {
      existingCategory.isArchived = false;
      existingCategory.color = color || existingCategory.color;
      existingCategory.icon = icon || existingCategory.icon;
      await existingCategory.save();
      return res.status(200).json(existingCategory);
    }

    const category = await Category.create({
      user: req.user.id,
      type,
      name: trimmedName,
      color: color || "",
      icon: icon || "",
      isSystem: false,
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category.", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id, user: req.user.id });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.isArchived = true;
    await category.save();

    return res.status(200).json({ message: "Category removed." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category.", error: error.message });
  }
};