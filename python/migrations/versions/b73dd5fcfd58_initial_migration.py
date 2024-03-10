"""initial migration

Revision ID: b73dd5fcfd58
Revises: 
Create Date: 2024-02-05 20:19:23.260404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b73dd5fcfd58'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ai_training_data',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('data', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('colors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('item_quantity', sa.Integer(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('image_path', sa.String(length=255), nullable=True),
    sa.Column('imageAlt', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_auth',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('chat_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('response', sa.Text(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user_auth.id'], name=op.f('fk_chat_messages_user_id_user_auth')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('openai_interactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('request_data', sa.Text(), nullable=False),
    sa.Column('response_data', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user_auth.id'], name=op.f('fk_openai_interactions_user_id_user_auth')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('product_colors',
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('color_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['color_id'], ['colors.id'], name=op.f('fk_product_colors_color_id_colors')),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_product_colors_product_id_products')),
    sa.PrimaryKeyConstraint('product_id', 'color_id')
    )
    op.create_table('shipping_info',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('address_line1', sa.String(length=255), nullable=False),
    sa.Column('address_line2', sa.String(length=255), nullable=True),
    sa.Column('city', sa.String(length=255), nullable=False),
    sa.Column('state', sa.String(length=255), nullable=False),
    sa.Column('postal_code', sa.String(length=20), nullable=False),
    sa.Column('country', sa.String(length=255), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user_auth.id'], name=op.f('fk_shipping_info_user_id_user_auth')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('confirmation_num', sa.String(length=36), nullable=False),
    sa.Column('shipping_info_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['shipping_info_id'], ['shipping_info.id'], name=op.f('fk_orders_shipping_info_id_shipping_info')),
    sa.ForeignKeyConstraint(['user_id'], ['user_auth.id'], name=op.f('fk_orders_user_id_user_auth')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('confirmation_num')
    )
    op.create_table('order_details',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('color_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['color_id'], ['colors.id'], name=op.f('fk_order_details_color_id_colors')),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name=op.f('fk_order_details_order_id_orders')),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_order_details_product_id_products')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_details')
    op.drop_table('orders')
    op.drop_table('shipping_info')
    op.drop_table('product_colors')
    op.drop_table('openai_interactions')
    op.drop_table('chat_messages')
    op.drop_table('user_auth')
    op.drop_table('products')
    op.drop_table('colors')
    op.drop_table('ai_training_data')
    # ### end Alembic commands ###
